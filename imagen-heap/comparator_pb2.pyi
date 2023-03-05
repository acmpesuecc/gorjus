from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class DeliverImageReply(_message.Message):
    __slots__ = ["image", "name"]
    IMAGE_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    image: bytes
    name: str
    def __init__(self, name: _Optional[str] = ..., image: _Optional[bytes] = ...) -> None: ...

class DeliverImageRequest(_message.Message):
    __slots__ = ["name"]
    NAME_FIELD_NUMBER: _ClassVar[int]
    name: str
    def __init__(self, name: _Optional[str] = ...) -> None: ...

class ImageCompareReply(_message.Message):
    __slots__ = ["comparison_percentage"]
    COMPARISON_PERCENTAGE_FIELD_NUMBER: _ClassVar[int]
    comparison_percentage: float
    def __init__(self, comparison_percentage: _Optional[float] = ...) -> None: ...

class ImageCompareRequest(_message.Message):
    __slots__ = ["image1name", "image2name"]
    IMAGE1NAME_FIELD_NUMBER: _ClassVar[int]
    IMAGE2NAME_FIELD_NUMBER: _ClassVar[int]
    image1name: str
    image2name: str
    def __init__(self, image1name: _Optional[str] = ..., image2name: _Optional[str] = ...) -> None: ...

class RenderImageReply(_message.Message):
    __slots__ = ["error", "image", "name"]
    ERROR_FIELD_NUMBER: _ClassVar[int]
    IMAGE_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    error: str
    image: bytes
    name: str
    def __init__(self, name: _Optional[str] = ..., error: _Optional[str] = ..., image: _Optional[bytes] = ...) -> None: ...

class RenderImageRequest(_message.Message):
    __slots__ = ["imageName", "image_css", "image_html"]
    IMAGENAME_FIELD_NUMBER: _ClassVar[int]
    IMAGE_CSS_FIELD_NUMBER: _ClassVar[int]
    IMAGE_HTML_FIELD_NUMBER: _ClassVar[int]
    imageName: str
    image_css: str
    image_html: str
    def __init__(self, imageName: _Optional[str] = ..., image_css: _Optional[str] = ..., image_html: _Optional[str] = ...) -> None: ...
