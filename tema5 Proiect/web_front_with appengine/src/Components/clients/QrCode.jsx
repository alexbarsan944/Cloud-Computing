import React from "react";

class QrCode extends React.Component {
    download = (event) => {
        event.preventDefault();
        var element = document.createElement("a");
        var file = new Blob(
            [
                "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + this.props.code
            ],
            { type: "image/*" }
        );
        element.href = URL.createObjectURL(file);
        element.download = "image.png";
        element.click();
    };

    render() {
        return (
            <div>
                <a onClick={this.download} href={"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + this.props.code} download="QRCODE">
                    <img src={"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + this.props.code} alt="QRCODE" />
                </a>
            </div >
        );
    }
}
export default QrCode;
