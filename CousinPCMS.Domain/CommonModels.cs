﻿using Newtonsoft.Json;

namespace CousinPCMS.Domain
{
    public class CommonModels
    {
    }

    public class CommodityModel
    {
        [JsonProperty("@odata.etag")]
        public string ODataEtag { get; set; }

        [JsonProperty("commodityCode")]
        public string CommodityCode { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }
    }

    public class CountryRegionModel
    {
        [JsonProperty("@odata.etag")]
        public string ODataEtag { get; set; }

        [JsonProperty("code")]
        public string Code { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("isoCode")]
        public string IsoCode { get; set; }

        [JsonProperty("isoNumericCode")]
        public string IsoNumericCode { get; set; }

        [JsonProperty("euCountryRegionCode")]
        public string EuCountryRegionCode { get; set; }

        [JsonProperty("intrastatCode")]
        public string IntrastatCode { get; set; }

        [JsonProperty("addressFormat")]
        public string AddressFormat { get; set; }

        [JsonProperty("contactAddressFormat")]
        public string ContactAddressFormat { get; set; }

        [JsonProperty("vatScheme")]
        public string VatScheme { get; set; }

        [JsonProperty("lastModifiedDateTime")]
        public DateTime LastModifiedDateTime { get; set; }

        [JsonProperty("countyName")]
        public string CountyName { get; set; }
    }
}
