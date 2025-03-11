|No| Page Name| BC API | Filter| Open Question |
| --- | --- | --- | --- | --- |
|1| My Order| purchaseheaders| BuyfromVendorNo_ = Logged In User's No field. | Is there any more filter required? |
|2| My Order Details - [General]|purchaseheaders|Values will be available from the existing API of purchase headers.|  API required |
|3| My Order Details - [Shipping Add.]|||  API required |
|4| My Order Details - [Billing]| || API required |
|5| My Order Details - [Lines]    | purchaselines| documentNo| Is there any more filter required? |
|6| My Order Details - [Receipts]    | purchasereceiptheaders||  How will it filter receipts based on order no? |
|7| My Order Details - [Receipt Line]    | purchasereceiptlines| DocumentNo_| It seems that there will be a need to have more filter here. |
|8| My Invoice| purchaseheaders| BuyfromVendorNo_| It cannot be same for both Order and Invoice. If there are 2 different screens. So what would be additional filter here? |
|9| My Invoice - [Processed]| postedpurchinvhdrs| AkkOnVATRegistrationNo_  = Logged In User's RFC Code | Will there be any filter required here? |
|10| My Invoice - [Uploaded]| documentocfdis||  Will there be any filter required here? |
|11| My Invoice Details - [General]|  ||API required |
|12| My Invoice Details - [Lines]| purchaseinvoicelines| documentNo| Total record values |
|13| My Invoice Details - [Receipts]| purchasereceiptheaders||  Filter required. |
|14| My Invoice Details - [Receipt Line]| purchasereceiptlines| DocumentNo_| It seems that there will be a need to have more filter here. |
|15| Payment|vendorledgerentrys|VendorNo_|  |
|16| Sign In| vendors| RFC,portalpassword |
|17| Register||| API required |
|18| Forgot Password ||| API required |




# My Order/Invoice Details
## General
- Order No ==> No_
- Date ==> Document Date
- Status ==> Status
- Currency ==> currencyCode
- Request Delivery Date ==> ???
- Contact Number ==> buyFromContactNo
- Purchaser ==> purchaserCode
- Payment Term ==> paymentTermsCode
- Shipping Method ==> shipmentMethodCode
- Prepayment Percentage ==> prepayment
- Your Order No ==> vendorOrderNo

## Shipping Address
- Address ==> shipToAddress
- Address 1 ==> shipToAddress2
- City ==> shipToCity
- County ==> shipToCounty
- Region ==> shipToCountryRegionCode
- Zip ==> shipToPostCode
- Country ==> ???

## Billing
- Name ==> payToName
- Code ==> payToVendorNo
- Address ==> payToAddress
- Address 1 ==> payToAddress2
- City ==> payToCity
- County ==> payToCounty
- Region ==> payToCountryRegionCode
- Zip ==> payToPostCode
- Country ==> ???

