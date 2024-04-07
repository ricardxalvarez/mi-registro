
def check_keys(keys: list[str], data: object) -> bool:
    if all(data[key] is not None for key in keys):
        return True
    else:
        return False