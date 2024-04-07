from datetime import datetime, timedelta

def parseTime(date_string: str) -> datetime:
    if not date_string:
        return None

    date_string_without_tz = date_string.split("GMT")[0].strip()

    # Define the format string (assuming no time zone information)
    format_string = "%a %b %d %Y %H:%M:%S" 

    # Parse the string and create a datetime object
    parsed_date = datetime.strptime(date_string_without_tz, format_string)

    return parsed_date