using System.Text.Json.Serialization;

namespace CousinPCMS.Domain
{
    public class DepartmentModel
    {
        [JsonPropertyName("@odata.etag")]
        public string ODataEtag { get; set; }
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
