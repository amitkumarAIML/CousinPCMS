using CousinPCMS.Domain;

namespace CousinPCMS.BLL
{
    public class TokenService
    {
        public APIResult<bool> CheckIfClientExists(Guid userId)
        {
            var result = new APIResult<bool>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var response = HardcodedValues.APIValidationId == userId;
                result.IsSuccess = true;
                result.Value = response;
            }
            catch (Exception exception)
            {
                result.IsSuccess = false;
                result.Value = false;
                result.ExceptionInformation = exception;
            }
            return result;
        }
    }
}
