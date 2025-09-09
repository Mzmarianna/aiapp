`python
import gspread
from oauth2client.service_account import ServiceAccountCredentials

scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name('your-credentials-file.json', scope)
client = gspread.authorize(creds)

# Replace with your Google Sheet name
doc = client.open('Your Google Sheet Name')
sheet = doc.sheet1

print(sheet.get_all_records())
