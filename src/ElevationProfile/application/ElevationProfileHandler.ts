import "reflect-metadata";

import { container, inject, injectable } from "tsyringe";

import Line from "../../Shared/domain/Line";
import LineToPointsInterval from "../../Shared/domain/LineToPointsInterval";
import wpsEndpoint from "../../Shared/domain/WPSEndpoint";
import PostmanHTTP from "../../Shared/infrastructure/PostmanHTTP";
import ElevationProfile from "../domain/ElevationProfile";
import TurfJSElevationProfileToleranceChecker from "../infraestructure/TurfJSElevationProfileToleranceChecker";
import { ElevationProfileResponseType } from "./ElevationProfileResponseType";
import ElevationProfileService from "./ElevationProfileService";

container.register("Postman", {
  useClass: PostmanHTTP,
});
container.register("ElevationProfileToleranceChecker", {
  useClass: TurfJSElevationProfileToleranceChecker,
});

@injectable()
export default class ElevationProfileHandler {
  private host: string;
  private lineToPoint: LineToPointsInterval;
  private service: ElevationProfileService;
  constructor(
    host: string,
    @inject("LineToPointsInterval")
    lineToPoint: LineToPointsInterval,
    service?: ElevationProfileService
  ) {
    this.host = host;
    this.lineToPoint = lineToPoint;
    if (service) {
      this.service = service;
    } else {
      this.service = container.resolve(ElevationProfileService);
    }
  }

  getFields(): JSON {
    return this.service.getFields();
  }

  async execute(
    lineString: string,
    responseType = ElevationProfileResponseType.LineString3D
  ): Promise<JSON> {
    const line: Line = Line.createFromString(lineString);
    const elevationProfile: ElevationProfile = new ElevationProfile(
      line,
      this.lineToPoint.execute(line),
      new wpsEndpoint(this.host)
    );

    return this.service.execute(elevationProfile, responseType);
  }
}
