using Newtonsoft.Json;

namespace CousinPCMS.Domain
{
    public class DepartmentModel
    {
        [JsonProperty("@odata.etag")]
        public string odataetag { get; set; }
        public int akiDepartmentID { get; set; }
        public string akiDepartmentName { get; set; }
        public int akiDepartmentListOrder { get; set; }
        public bool akiDepartmentWebActive { get; set; }
        public bool akiDeptPromptUserifblank { get; set; }
        public string akiDepartmentDescText { get; set; }
        public string akiDepartmentImageURL { get; set; }
        public int akiDepartmentImageHeight { get; set; }
        public int akiDepartmentImageWidth { get; set; }
        public string akiDepartmentKeyWords { get; set; }
        public string akiDepartmentCommodityCode { get; set; }
        public int akiDeptParent { get; set; }
        public bool akiDepartmentIsActive { get; set; }
        public string akiLayoutTemplate { get; set; }
        public string akiColor { get; set; }
        public string akiFeaturedProdBGColor { get; set; }
    }

    public class AddDepartmentRequestModel
    {
        public int akiDepartmentID { get; set; }
        public string akiDepartmentName { get; set; }
        public int akiDepartmentListOrder { get; set; }
        public bool akiDeptPromptUserifblank { get; set; }
        public string akiDepartmentDescText { get; set; }
        public string akiDepartmentImageURL { get; set; }
        public int akiDepartmentImageHeight { get; set; }
        public int akiDepartmentImageWidth { get; set; }
        public string akiDepartmentKeyWords { get; set; }
        public string akiDepartmentCommodityCode { get; set; }
        public int akiDeptParent { get; set; }
        public string akiLayoutTemplate { get; set; }
        public string akiColor { get; set; }
        public string akiFeaturedProdBGColor { get; set; }
    }

    public class UpdateDepartmentRequestModel
    {
        public int akiDepartmentID { get; set; }
        public string akiDepartmentName { get; set; }
        public int akiDepartmentListOrder { get; set; }
        public bool akiDepartmentWebActive { get; set; }
        public bool akiDeptPromptUserifblank { get; set; }
        public string akiDepartmentDescText { get; set; }
        public string akiDepartmentImageURL { get; set; }
        public int akiDepartmentImageHeight { get; set; }
        public int akiDepartmentImageWidth { get; set; }
        public string akiDepartmentKeyWords { get; set; }
        public string akiDepartmentCommodityCode { get; set; }
        public int akiDeptParent { get; set; }
        public string akiLayoutTemplate { get; set; }
        public string akiColor { get; set; }
        public string akiFeaturedProdBGColor { get; set; }
    }

    public class DeleteDepartmentRequestModel
    {
        public int departmentID { get; set; }
    }

    public class DepartmentLayoutModel
    {
        [JsonProperty("@odata.etag")]
        public string ODataEtag { get; set; }

        [JsonProperty("departmentId")]
        public int DepartmentId { get; set; }

        [JsonProperty("templateCode")]
        public string TemplateCode { get; set; }

        [JsonProperty("layoutDescription")]
        public string LayoutDescription { get; set; }
    }
}
