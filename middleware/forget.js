const watermark = 'https://res.cloudinary.com/ddmh8i1m1/image/upload/v1759258400/Untitled1_q0cjdo.bmp';
const logo = 'https://res.cloudinary.com/ddmh8i1m1/image/upload/v1759228791/logo1_qmce8b.png';
const linkedIn = 'https://res.cloudinary.com/dbzzkaa97/image/upload/v1754433533/linkedIn_ggxxm4.png';
const instagram = 'https://res.cloudinary.com/dbzzkaa97/image/upload/v1754433533/instagram_p8byzw.png';
const facebook = 'https://res.cloudinary.com/dbzzkaa97/image/upload/v1754433532/facebook_rjeokq.png';

const forgethtml = (verifyLink, firstName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html" charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Go-Meal</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet">
        <style>
          *{ margin: 0; padding: 0; }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
      <center style="width: 100%;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; font-family: Poppins, sans-serif; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          
          <tr>
            <td align="center" style="background: #333333; padding: 20px; border-radius: 10px 10px 0 0;">
              <img src="${logo}" width="140" alt="Go-Meal Logo" style="display: block; margin: 0 auto;">
              <h1 style="font-size: 25px; color: #ffffff; margin-top: 10px; font-weight: 600;">Password Reset</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 20px; color: #333333; text-align: left;">
              <p style="font-size: 17px; margin: 0 0 15px;">Hello ${firstName},</p>
              <p style="font-size: 17px; margin: 0 0 25px;">We received a request to reset your password. Please click the button below to reset it:</p>
              
              <table align="center" cellpadding="0" cellspacing="0" style="margin: 20px auto;">
                <tr>
                  <td align="center" style="border-radius: 5px; background-color: #28a745;">
                    <a href="${verifyLink}" target="_blank" style="display: inline-block; padding: 15px 30px; font-size: 18px; color: #ffffff; text-decoration: none; border-radius: 5px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); font-weight: 600; line-height: 1.2;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 17px; margin: 25px 0 10px;">If you did not request a password reset, kindly ignore this email.</p>
              <p style="font-size: 17px;">Best regards,<br>Go Meal</p>
            </td>
          </tr>
          
          <tr>
            <td style="height: 200px; background: url(${watermark}) center / cover no-repeat; text-align: center;">
              <table width="80%" cellpadding="0" cellspacing="0" style="color: #ffffff; margin: 0 auto;">
                <tr>
                  <td align="center">
                    <h3 style="margin: 0; font-size: 25px; margin-top: 10px;">GoMeal</h3>
                    <p style="margin: 8px 0 15px; font-size: 12px;">
                      <b> Go-Meal</b>. Delicious meals-Speed, simplicity, and satisfaction <br>at your doorstep..
                    </p>
                    <table cellpadding="5" cellspacing="0" style="margin: 10px 0; text-align: center;">
                      <tr>
                        <td style="font-size: 12px;">Follow us:</td>
                        <td><a href=""><img src="${linkedIn}" alt="LinkedIn" width="20" style="vertical-align: middle; margin-left: 10px;"></a></td>
                        <td><a href=""><img src="${facebook}" alt="Facebook" width="20" style="vertical-align: middle; margin-left: 5px;"></a></td>
                        <td><a href=""><img src="${instagram}" alt="Instagram" width="20" style="vertical-align: middle; margin-left: 5px;"></a></td>
                      </tr>
                    </table>
                    <p style="margin: 10px 0 0; font-size: 12px;">
                      Contact us: &nbsp; +234 805 1897 781 &nbsp;
                      <a href="mailto:gomealofficial@gmail.com" style="color: #ffffff; text-decoration: underline;">
                        gomealofficial@gmail.com
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="height: 5px; background-color: #f3bf04; padding: 5px; color: #ffffff; text-align: center; font-size: 12px;">
                &copy; ${new Date().getFullYear()} . All rights reserved.
            </td>
          </tr>
        </table>
      </center>
    </body>
    </html>
  `;
};

module.exports = { forgethtml };