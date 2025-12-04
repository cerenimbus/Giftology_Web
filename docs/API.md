# API Integration Documentation

## Overview

The Giftology Relationship Radar web application integrates with the Giftology RRService API. All API communication is handled through a centralized API client that manages authentication, request signing, and response parsing.

## Base Configuration

### API Base URL

- **Production**: `https://radar.Giftologygroup.com/RRService`
- **Development**: Proxied through Vite dev server at `/RRService`

### Environment Configuration

Set `VITE_API_BASE` environment variable to override the default base URL:

```env
VITE_API_BASE=https://radar.Giftologygroup.com/RRService
```

## Request Format

### HTTP Method
All API calls use **GET** method.

### URL Format
```
{URL}/RRService/{function}.php?arg1=value1&arg2=value2...
```

### Request Parameters

All requests include standard parameters:

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `DeviceID` | string | Unique device identifier (up to 60 chars) | Yes |
| `Date` | string | Current date/time (MM/DD/YYYY-HH:mm) | Yes |
| `Key` | string | SHA-1 hash for request signing (40 chars) | Yes |
| `AC` | string | Authorization Code (40 chars) | Yes* |
| `Language` | string | Language code (e.g., "EN") | Yes* |
| `MobileVersion` | string | Application version number | Yes* |

*Required for authenticated endpoints (not required for `AuthorizeUser` and `AuthorizeDeviceID`)

### Key Generation

The `Key` parameter is a SHA-1 hash used for request signing:

#### AuthorizeUser
```
Key = SHA-1(DeviceID + Date)
```

#### AuthorizeDeviceID
```
Key = SHA-1(DeviceID + Date)
```

#### All Other Endpoints
```
Key = SHA-1(DeviceID + Date + AuthorizationCode + DeviceID)
```

### URL Encoding

All parameter values should be URL-encoded. The API client handles this automatically.

## Response Format

### XML Response Structure

All API responses are in XML format:

```xml
<ResultInfo>
  <ErrorNumber>0</ErrorNumber>
  <Result>Success</Result>
  <Message>Operation completed successfully</Message>
  <!-- Additional response data -->
</ResultInfo>
```

### Error Codes

| Code | Description |
|------|-------------|
| 0 | No Error |
| 100 | Generic Error |
| 101 | Request not recognized |
| 102 | Security Failure - incorrect hash key |
| 103 | MySQL programming error |
| 104 | Required information not supplied |
| 105 | Username and password does not match User records |
| 106 | Giftology version not current |
| 201 | Authorization Code already in use |
| 202 | Invalid Authorization Code |
| 203 | Device not authorized |
| 204 | Not within required distance |
| 205 | Requires valid longitude and latitude |
| 206 | Function not authorized for this user |
| 207 | Quote search did not find any quote |
| 301 | Authorization Code not in use |
| 302 | Invalid work package found |
| 303 | DeAuthorize from wrong device |
| 401 | (Reserved) |
| 402 | (Reserved) |
| 501 | Incorrect Authorization Code for this device |

## API Endpoints

### Authentication Endpoints

#### AuthorizeUser

**Description**: Initial user authentication. Sends SMS code to user's phone.

**Endpoint**: `AuthorizeUser.php`

**Parameters**:
- `DeviceID` (string, required)
- `DeviceType` (string, required) - e.g., "Web", "Android", "iPhone"
- `DeviceModel` (string, required) - Device model
- `DeviceVersion` (string, required) - Device version
- `Date` (string, required) - MM/DD/YYYY-HH:mm
- `Key` (string, required) - SHA-1(DeviceID + Date)
- `UserName` (string, required) - Username
- `Password` (string, required) - Password
- `Language` (string, required) - Language code
- `MobileVersion` (string, required) - App version

**Response**:
```xml
<ResultInfo>
  <ErrorNumber>0</ErrorNumber>
  <Result>Success</Result>
  <Message>Security code sent to your phone</Message>
  <Comp>Company Name</Comp>
  <Name>Employee Name</Name>
</ResultInfo>
```

**Usage**:
```javascript
import { AuthorizeUser } from '../utils/api'

const res = await AuthorizeUser({
  UserName: 'username',
  Password: 'password',
  Language: 'EN',
  MobileVersion: '1'
})
```

#### AuthorizeDeviceID

**Description**: Verify SMS code and receive Authorization Code.

**Endpoint**: `AuthorizeDeviceID.php`

**Parameters**:
- `DeviceID` (string, required)
- `Date` (string, required)
- `Key` (string, required) - SHA-1(DeviceID + Date)
- `UserName` (string, required)
- `Password` (string, required)
- `SecurityCode` (string, required) - 6-digit SMS code
- `Language` (string, required)
- `MobileVersion` (string, required)

**Response**:
```xml
<ResultInfo>
  <ErrorNumber>0</ErrorNumber>
  <Result>Success</Result>
  <Message>Security code accepted</Message>
  <Auth>4d4f60a5-b591-4a7e-a1d5-072e117aa904</Auth>
</ResultInfo>
```

**Usage**:
```javascript
import { AuthorizeDeviceID } from '../utils/api'

const res = await AuthorizeDeviceID({
  SecurityCode: '123456',
  UserName: 'username',
  Password: 'password',
  Language: 'EN',
  MobileVersion: '1'
})

// Extract AC from response
const ac = res?.parsed?.Auth || res?.parsed?.auth || ''
```

### Data Endpoints

#### GetDashboard

**Description**: Retrieve dashboard data including partners, relationships, tasks, and metrics.

**Endpoint**: `GetDashboard.php`

**Parameters**:
- `DeviceID` (string, required)
- `Date` (string, required)
- `Key` (string, required)
- `AC` (string, required) - Authorization Code
- `Language` (string, required)
- `MobileVersion` (string, required)

**Response Structure**:
```xml
<ResultInfo>
  <ErrorNumber>0</ErrorNumber>
  <Result>Success</Result>
  <Message></Message>
  <Selections>
    <BestPartner>
      <Name>Contact Name</Name>
      <ContactSerial>123</ContactSerial>
      <Amount>$1,000</Amount>
    </BestPartner>
    <Current>
      <Name>Contact Name</Name>
      <ContactSerial>123</ContactSerial>
      <Phone>(555) 123-4567</Phone>
    </Current>
    <Recent>
      <Name>Contact Name</Name>
      <ContactSerial>123</ContactSerial>
      <Phone>(555) 123-4567</Phone>
    </Recent>
    <Task>
      <Name>Contact Name</Name>
      <ContactSerial>123</ContactSerial>
      <TaskSerial>456</TaskSerial>
      <TaskName>Task Description</TaskName>
      <Date>12/25/2024</Date>
    </Task>
    <DOV>
      <Name>DOV Type</Name>
      <Count>5</Count>
    </DOV>
    <HarmlessStarter>10</HarmlessStarter>
    <Greenlight>5</Greenlight>
    <ClarityConvos>3</ClarityConvos>
    <TotalDOV>18</TotalDOV>
    <Introduction>2</Introduction>
    <Referral>1</Referral>
    <Partner>3</Partner>
  </Selections>
</ResultInfo>
```

**Usage**:
```javascript
import { GetDashboard } from '../utils/api'

const res = await GetDashboard()
if (res?.success) {
  const data = res.data
  // Access dashboard data
}
```

#### GetTaskList

**Description**: Retrieve list of tasks for the authenticated user.

**Endpoint**: `GetTaskList.php`

**Response**:
```xml
<ResultInfo>
  <Selections>
    <Task>
      <Name>Task Name</Name>
      <Serial>123</Serial>
      <Contact>Contact Name</Contact>
      <Date>12/25/2024</Date>
      <Status>0</Status>
    </Task>
  </Selections>
</ResultInfo>
```

#### GetTask

**Description**: Retrieve details for a specific task.

**Endpoint**: `GetTask.php`

**Parameters**:
- Standard parameters plus:
- `Task` (integer, required) - Task serial number

#### UpdateTask

**Description**: Update task status.

**Endpoint**: `UpdateTask.php`

**Parameters**:
- Standard parameters plus:
- `Task` (integer, required) - Task serial number
- `Status` (integer, required) - 1 for done, 0 for not done

#### GetDOVDateList

**Description**: Retrieve DOV (Date of Value) dates.

**Endpoint**: `GetDOVDateList.php`

**Response**:
```xml
<ResultInfo>
  <Selections>
    <Harmless>
      <Name>Contact Name</Name>
      <ContactSerial>123</ContactSerial>
      <Date>12/25/2024</Date>
    </Harmless>
    <Greenlight>
      <Name>Contact Name</Name>
      <ContactSerial>123</ContactSerial>
      <Date>12/25/2024</Date>
    </Greenlight>
    <Clarity>
      <Name>Contact Name</Name>
      <ContactSerial>123</ContactSerial>
      <Date>12/25/2024</Date>
    </Clarity>
  </Selections>
</ResultInfo>
```

#### GetContactList

**Description**: Retrieve list of contacts.

**Endpoint**: `GetContactList.php`

#### GetContact

**Description**: Retrieve details for a specific contact.

**Endpoint**: `GetContact.php`

**Parameters**:
- Standard parameters plus:
- `Serial` (integer, required) - Contact serial number

### Utility Endpoints

#### ResetPassword

**Description**: Reset user password.

**Endpoint**: `ResetPassword.php`

**Parameters**:
- Standard parameters plus:
- `Password` (string, required) - New password (minimum 8 characters)

#### GetHelp

**Description**: Retrieve help content.

**Endpoint**: `GetHelp.php`

**Parameters**:
- Standard parameters plus:
- `HelpID` (string, required) - Help page identifier

#### UpdateFeedback

**Description**: Submit user feedback.

**Endpoint**: `UpdateFeedback.php`

**Parameters**:
- Standard parameters plus:
- `Name` (string, optional) - User name
- `Email` (string, optional) - User email
- `Phone` (string, optional) - User phone
- `Response` (integer, optional) - 1 if response wanted, 0 otherwise
- `Update` (integer, optional) - 1 if updates requested, 0 otherwise
- `Comment` (string, optional) - Feedback comment

## API Client Implementation

### Location
`src/utils/api.js`

### Key Functions

#### `callService(functionName, extraParams, paramOrder)`
Central function for making API calls. Handles:
- Device ID retrieval
- Date formatting
- Key generation
- Request signing
- Response parsing
- Error handling

#### Individual API Functions
Each endpoint has a dedicated function:
- `AuthorizeUser(payload)`
- `AuthorizeDeviceID({ SecurityCode, UserName, Password, ... })`
- `GetDashboard()`
- `GetTaskList()`
- `GetTask({ Task })`
- `UpdateTask({ Task, Status })`
- `GetDOVDateList()`
- `GetContactList()`
- `GetContact({ Serial })`
- `ResetPassword({ Password })`
- `GetHelp({ HelpID })`
- `UpdateFeedback({ Name, Email, Phone, Response, Update, Comment })`

### Response Format

All API functions return a consistent response object:

```javascript
{
  success: boolean,        // true if Result === "Success"
  errorNumber: number,     // Error code from API
  message: string,         // Message from API
  raw: object,            // Raw parsed XML object
  parsed: object,         // Processed response data
  requestUrl: string      // Full request URL (for debugging)
}
```

### Error Handling

The API client handles:
- Network errors
- Timeout errors (30-second timeout)
- XML parsing errors
- Invalid responses
- Security failures

Errors are logged to console and returned in the response object.

## Security

### Request Signing

All requests are signed using SHA-1 hashing to prevent tampering. The key generation algorithm varies by endpoint type.

### Device ID

Each device/browser has a unique Device ID stored in localStorage. This ID is used for:
- Request signing
- Device authorization
- Session management

### Authorization Code

The Authorization Code (AC) is:
- Received from `AuthorizeDeviceID` endpoint
- Stored in a secure cookie (30-day expiration)
- Included in all authenticated requests
- Used in key generation for request signing

## Development

### Proxy Configuration

During development, API requests are proxied through the Vite dev server to avoid CORS issues:

```javascript
// vite.config.js
proxy: {
  '/RRService': {
    target: 'https://radar.Giftologygroup.com',
    changeOrigin: true,
    secure: false,
  }
}
```

### Debugging

Enable debug logging:
```javascript
localStorage.setItem('debug', 'true')
```

Debug logs include:
- Request parameters (masked for security)
- Request URLs
- Response data
- Error details

## Testing

### Manual Testing

1. Test authentication flow
2. Verify request signing
3. Check response parsing
4. Test error handling
5. Verify cookie storage

### API Testing

Use browser DevTools Network tab to:
- Inspect request URLs
- Verify parameters
- Check response format
- Debug errors

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure proxy is configured in `vite.config.js`
   - Restart dev server after proxy changes

2. **Security Failures (Error 102)**
   - Verify key generation algorithm
   - Check Device ID is present
   - Ensure AC is valid and not expired

3. **Invalid Authorization Code (Error 202)**
   - Check cookie expiration
   - Re-authenticate if expired
   - Verify AC format

4. **Timeout Errors**
   - Check network connection
   - Verify API server is accessible
   - Increase timeout if needed

## Additional Resources

- [Cookie Storage Documentation](COOKIE_STORAGE.md)
- [Architecture Documentation](ARCHITECTURE.md)
- [Development Guide](DEVELOPMENT.md)

