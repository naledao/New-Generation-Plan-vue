const secrct='chds68mndkjclwe27384h2fdu83ygt378fb7243'
import md5 from 'js-md5'

export const tomd5=async (message)=>{
    message=message+secrct
    return md5(message)
}