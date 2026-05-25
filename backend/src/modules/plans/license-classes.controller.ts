import { Controller, Get } from "@nestjs/common"
import { LicenseClassesService } from "./license-classes.service"

@Controller("license-classes")
export class LicenseClassesController {
  constructor(private readonly service: LicenseClassesService) {}

  @Get()
  list() {
    return this.service.listCatalog()
  }
}
