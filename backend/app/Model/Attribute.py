from app.Model.Enums import DataType


class Attribute:
    name = ""
    table_name = ""
    type = None
    is_primary_key = False

    def __init__(self, name, table_name, type, is_primary_key=False):
        self.name = name
        self.table_name = table_name
        self.type = self.set_attribute_type(type)
        self.is_primary_key = is_primary_key
        self.set_is_primary_key()

    def set_is_primary_key(self):
        if self.name == "id":
            self.is_primary_key = True

    def set_attribute_type(self, type):
        if type.startswith("int"):
            return DataType.int
        if type.startswith("float") or type.startswith("numeric"):
            return DataType.float
        if type.startswith("var") or type.startswith("text"):
            return DataType.text
        if type.startswith("date"):
            return DataType.date
        if type.startswith("bool"):
            return DataType.bool
        if type.startswith("coord"):
            return DataType.coordinates

    def get_attribute_type(self):
        return self.type.name
