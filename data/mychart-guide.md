# How to Find Your MyChart FHIR Token

## Option 1: Using Browser Developer Tools

1. Log into your MyChart account at Atrium or Novant
2. Open Developer Tools (F12 or Right-click -> Inspect)
3. Go to the "Application" tab
4. Look in the following locations:
   - Local Storage
   - Session Storage
   - Cookies
5. Search for items containing: "token", "fhir", "epic", "atrium", "access"

## Option 2: Using Third-Party App Connections

1. Log into your MyChart account
2. Go to Account Settings
3. Look for "Linked Apps & Devices" or "Third-Party Apps"
4. You may find options to generate API access tokens here

## Option 3: Checking Network Requests

1. Open Developer Tools (F12) and go to the "Network" tab
2. Browse your health records in MyChart
3. Look for requests to URLs containing "fhir" or "epic"
4. Examine the request headers for Authorization tokens

## Option 4: Using Apple Health App

1. Download the Apple Health app if you have an iPhone
2. Connect your MyChart account to Apple Health
3. This may generate the necessary tokens behind the scenes
