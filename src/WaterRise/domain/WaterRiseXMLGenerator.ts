export default interface WaterRiseXMLGenerator {
  generate(
    mdeLayerFullname: string,
    rectangle: string,
    level: number,
    areaBackgroundColor: string
  ): string;
}
