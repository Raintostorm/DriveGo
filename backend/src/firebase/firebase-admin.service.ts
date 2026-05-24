import { Injectable, OnModuleInit } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import * as admin from "firebase-admin"
import { readFileSync } from "fs"
import { resolve } from "path"

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private ready = false

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    if (admin.apps.length > 0) {
      this.ready = true
      return
    }

    const projectId = this.config.get<string>("FIREBASE_PROJECT_ID")
    const credPath = this.config.get<string>("GOOGLE_APPLICATION_CREDENTIALS")
    if (!projectId || !credPath) {
      return
    }

    const absolutePath = resolve(process.cwd(), credPath)
    const serviceAccount = JSON.parse(readFileSync(absolutePath, "utf8")) as admin.ServiceAccount

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    })
    this.ready = true
  }

  isConfigured() {
    return this.ready
  }

  async verifyIdToken(idToken: string) {
    if (!this.ready) {
      throw new Error("Firebase Admin chưa cấu hình")
    }
    return admin.auth().verifyIdToken(idToken)
  }
}
