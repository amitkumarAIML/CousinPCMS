using Newtonsoft.Json;

namespace CousinPCMS.Domain
{
    public class DepartmentModel
    {
        [JsonProperty("@odata.etag")]
        public string ODataEtag { get; set; }

        [JsonProperty("akiDepartmentID")]
        public int AkiDepartmentID { get; set; }

        [JsonProperty("akiDepartmentName")]
        public string AkiDepartmentName { get; set; }

        [JsonProperty("akiDepartmentListOrder")]
        public int AkiDepartmentListOrder { get; set; }

        [JsonProperty("akiDepartmentWebActive")]
        public bool AkiDepartmentWebActive { get; set; }

        [JsonProperty("akiDepartmentDescText")]
        public string AkiDepartmentDescText { get; set; }

        [JsonProperty("akiDepartmentImageURL")]
        public string AkiDepartmentImageURL { get; set; }

        [JsonProperty("akiDepartmentImageHeight")]
        public int AkiDepartmentImageHeight { get; set; }

        [JsonProperty("akiDepartmentImageWidth")]
        public int AkiDepartmentImageWidth { get; set; }

        [JsonProperty("akiDepartmentKeyWords")]
        public string AkiDepartmentKeyWords { get; set; }

        [JsonProperty("akiDepartmentCommodityCode")]
        public string AkiDepartmentCommodityCode { get; set; }

        [JsonProperty("AKI_DeptPromptUserifblank")]
        public bool AKI_DeptPromptUserIfBlank { get; set; }

        [JsonProperty("AKI_Dept_Parent")]
        public int AKI_Dept_Parent { get; set; }

        [JsonProperty("AKI_Catalogue_Active")]
        public bool AKI_Catalogue_Active { get; set; }

        [JsonProperty("AKI_Layout_Template")]
        public string AKI_Layout_Template { get; set; }

        [JsonProperty("AKI_Color")]
        public string AKI_Color { get; set; }

        [JsonProperty("AKI_Featured_Prod_BG_Color")]
        public string AKI_Featured_Prod_BG_Color { get; set; }
    }

    public class AddDepartmentRequestModel
    {
        public int AkiDepartmentID { get; set; }
        public string AkiDepartmentName { get; set; }
        public int AkiDepartmentListOrder { get; set; }
        public bool AkiDepartmentWebActive { get; set; }
        public string AkiDepartmentDescText { get; set; }
        public string AkiDepartmentImageURL { get; set; }
        public int AkiDepartmentImageHeight { get; set; }
        public int AkiDepartmentImageWidth { get; set; }
        public string AkiDepartmentKeyWords { get; set; }
        public string AkiDepartmentCommodityCode { get; set; }
        public bool AKI_DeptPromptUserIfBlank { get; set; }
        public int AKI_Dept_Parent { get; set; }
        public bool AKI_Catalogue_Active { get; set; }
        public string AKI_Layout_Template { get; set; }
        public string AKI_Color { get; set; }
        public string AKI_Featured_Prod_BG_Color { get; set; }
    }
}
