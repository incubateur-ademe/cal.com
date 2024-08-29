import { API_VERSIONS_VALUES } from "@/lib/api-versions";
import { PlatformPlan } from "@/modules/auth/decorators/billing/platform-plan.decorator";
import { Roles } from "@/modules/auth/decorators/roles/roles.decorator";
import { ApiAuthGuard } from "@/modules/auth/guards/api-auth/api-auth.guard";
import { PlatformPlanGuard } from "@/modules/auth/guards/billing/platform-plan.guard";
import { IsAdminAPIEnabledGuard } from "@/modules/auth/guards/organizations/is-admin-api-enabled.guard";
import { IsOrgGuard } from "@/modules/auth/guards/organizations/is-org.guard";
import { RolesGuard } from "@/modules/auth/guards/roles/roles.guard";
import {
  CreateOrganizationAttributeInput,
} from "@/modules/organizations/inputs/attributes/create-organization-attribute.input";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";

import { SkipTakePagination } from "@calcom/platform-types";
import { UpdateOrganizationAttributeInput } from "@/modules/organizations/inputs/attributes/update-organization-attribute.input";
import { OrganizationAttributesService } from "@/modules/organizations/services/attributes/organization-attributes.service";
import { SUCCESS_STATUS } from "@calcom/platform-constants";
@Controller({
  path: "/v2/organizations/:orgId",
  version: API_VERSIONS_VALUES,
})
@UseGuards(ApiAuthGuard, IsOrgGuard, RolesGuard, PlatformPlanGuard, IsAdminAPIEnabledGuard)
export class OrganizationsAttributesController {
  constructor(private readonly organizationsAttributesService: OrganizationAttributesService) {}
  // Gets all attributes for an organization
  @Roles("ORG_MEMBER")
  @PlatformPlan("ESSENTIALS")
  @Get("/attributes")
  async getOrganizationAttributes(
    @Param("orgId", ParseIntPipe) orgId: number,
    @Query() queryParams: SkipTakePagination
  ) {
    const { skip, take } = queryParams;
    const attributes = await this.organizationsAttributesService.getOrganizationAttributes(orgId, skip, take);

    return {
      status: SUCCESS_STATUS,
      data: attributes,
    };
  }

  // Gets a single attribute for an organization
  @Roles("ORG_MEMBER")
  @PlatformPlan("ESSENTIALS")
  @Get("/attributes/:attributeId")
  async getOrganizationAttribute(
    @Param("orgId", ParseIntPipe) orgId: number,
    @Param("attributeId") attributeId: string
  ) {
    const attribute = await this.organizationsAttributesService.getOrganizationAttribute(orgId, attributeId);
    return {
      status: SUCCESS_STATUS,
      data: attribute,
    };
  }

  // Creates an attribute for an organization
  @Roles("ORG_ADMIN")
  @PlatformPlan("ESSENTIALS")
  @Post("/attributes")
  async createOrganizationAttribute(
    @Param("orgId", ParseIntPipe) orgId: number,
    @Body() bodyAttribute: CreateOrganizationAttributeInput
  ) {
    const attribute = await this.organizationsAttributesService.createOrganizationAttribute(orgId, bodyAttribute);
    return {
      status: SUCCESS_STATUS,
      data: attribute,
    };
  }

  // Updates an attribute for an organization
  @Roles("ORG_ADMIN")
  @PlatformPlan("ESSENTIALS")
  @Patch("/attributes/:attributeId")
  async updateOrganizationAttribute(
    @Param("orgId", ParseIntPipe) orgId: number,
    @Param("attributeId") attributeId: string,
    @Body() bodyAttribute: UpdateOrganizationAttributeInput
  ) {
    const attribute = await this.organizationsAttributesService.updateOrganizationAttribute(orgId, attributeId, bodyAttribute);
    return {
      status: SUCCESS_STATUS,
      data: attribute,
    };
  }

  // Deletes an attribute for an organization
  @Roles("ORG_ADMIN")
  @PlatformPlan("ESSENTIALS")
  @Delete("/attributes/:attributeId")
  async deleteOrganizationAttribute(
    @Param("orgId", ParseIntPipe) orgId: number,
    @Param("attributeId") attributeId: string
  ) {
    const attribute = await this.organizationsAttributesService.deleteOrganizationAttribute(orgId, attributeId);
    return {
      status: SUCCESS_STATUS,
      data: attribute,
    };
  }

}
