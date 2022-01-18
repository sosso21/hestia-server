 const validateEmail = (email) =>
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
 const validatePhone =(phone)=>{ 
     return !!`0${phone}`.match(/^\d{10}$/g)
    } 


    module.exports = {validateEmail,validatePhone}