import { Controller, Get } from "@nestjs/common"
import { PlansService } from "./plans.service"

@Controller("plans")
export class PlansController {
  constructor(private readonly service: PlansService) {}

  @Get()
  list() {
    return this.service.list()
  }
}
