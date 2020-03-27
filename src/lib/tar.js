export default function tar(filename, byte_string) {
    let data = filename;
    if(data.length >= 100) {
        throw new Error("filename too long");
    }
    while(data.length !== 100) { // filename padding
        data += "\0";
    }

    data += "0000664\0"; // file mode
    data += "0001751\0"; // user id
    data += "0001751\0"; // group id

    let _byte_string_length = byte_string.length + 1 + "";
    let byte_string_length = "";
    while(_byte_string_length !== 0) {
        byte_string_length = (_byte_string_length % 8) + byte_string_length;
        _byte_string_length /= 8;
        _byte_string_length = parseInt(_byte_string_length);
    }
    if(byte_string_length.length >= 11) {
        throw new Error("file too large");
    }
    while(byte_string_length.length !== 11) {
        byte_string_length = "0" + byte_string_length;
    }
    byte_string_length += "\0";
    data += byte_string_length;
    data += "13611743626\0";

    let sum = 0;
    for(let i = 0; i < data.length; ++i) {
        sum += data.charCodeAt(i);
    }

    sum += ' '.charCodeAt(0) * 7;
    sum += " ".charCodeAt(0) + "0".charCodeAt(0); // add typeflag
    sum %= 262144;

    let checksum = "";
    for(let i = 0; i < 6; ++i) { // checksum
        checksum = (sum % 8) + checksum;
        sum /= 8;
        sum = parseInt(sum);
    }
    data += checksum;
    data += "\0 0";

    //header padding
    while(data.length < 512) {
        data += "\0";
    }

    // content
    data += byte_string;

    // padding
    data += "\n";
    while(data.length % 512 !== 0) {
        data += "\0";
    }
    return data;
}