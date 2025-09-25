const EmailWrapper = (content: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Olakz - Bringing the excitement of task to everyone</title>
  <style>
    /* Set default font and background color */
    body {
      font-family: Arial, sans-serif;
      background-color: #F5F5F5;
      color: #333;
      font-size: 14px;
      line-height: 1.5;
    }

    /* Add green color scheme */
    .green {
      color: #41917be6;
    }

    /* Add a green button style */
    .green-btn {
      width: 100px;
      background-color: #41917be6;
      border: none;
      color: #fff;
      padding: 10px 5px;
      border-radius: 4px;
      text-decoration: none;
      margin: 20px auto;
      font-weight: 600;
      font-size: 1.8rem;
      text-align: center;
    }

    /* Add a header style */
    .header {
      background-color: #41917be6;
      padding: 30px;
    }

    /* Add a header title style */
    .header h1 {
      color: #fff;
      font-size: 24px;
      margin: 0;
    }

    /* Add a header subtitle style */
    .header p {
      color: #fff;
      font-size: 14px;
      margin: 0;
    }

    /* Add a section style */
    .section {
      background-color: #fff;
      padding: 30px;
    }

    /* Add a section title style */
    .section h2 {
      color: #41917be6;
      font-size: 18px;
      margin: 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #41917be6;
    }

    /* Add a section content style */
    .section p {
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
      padding-top: 20px;
    }
 
  </style>
</head>
<body>
  <div class="header">
    <h1>Olakz</h1>
    <p>Bringing the excitement of digital shopping to everyone</p>
  </div>
  <div class="section">
    ${content}
  </div>
  <div class="section">
    <h2>Latest tasks and updates</h2>
    <p style="font-size: 0.9em">Regards,<br />Olakz </p>
    <hr style="border: none; border-top: 1px solid #eee" />
    <div style="float: right; padding: 8px 0; color: #aaa; font-size: 1rem; line-height: 1; font-weight: 300">
      <p>Olakz: Better Gaming<br/>olakzride@gmail.com<br/>Lagos, Nigeria</p>
    </div>
  </div>
</body> 
</html>      

`;
};

export const welcomeEmail = () =>
  EmailWrapper(`
    <h2>Hello !</h2>
    <p>We hope this email finds you well. At Olakz, we are dedicated to providing the best task gaming experience to all our users. Whether you are a seasoned  or just starting out, we have something for everyone.</p>
    <p>In this email, you will find information about our latest tasks, updates, and special offers. We are constantly working to improve our platform and add new features, so stay tuned for more exciting news!</p>

    <p>We are a leading task gaming company and we aim to provide the best gaming experience for all task enthusiasts.</p>
    <p>Join us today and start playing!</p>
`);

export const signupRequestOTPEmail = (otp?: string) =>
  EmailWrapper(`
  <h2>Hello!</h2>

  <p>Thank you for choosing Olakz for your all digital experience. To complete your signup process, please enter the following One Time Password (OTP) within the next 5 minutes:</p>

  <div class="green-btn">
      ${otp}
  </div>

  <p>Please note that this OTP is only valid for 5 minutes and is for verifying your account. If you did not make this request, please reach out to us immediately.</p>
  <p>We look forward to providing you with the best gaming experience at Olakz.</>
`);

export const signupCompleteEmail = (Name?: string) =>
  EmailWrapper(`<p style="font-size: 1.1em">Hello ${Name},</p>
    <p>Welcome to Olakz. At Olakz, we are dedicated to providing the best task gaming experience to all our users. Whether you are a seasoned  or just starting out, we have something for everyone.</p>
    <p>In this email, you will find information about our latest tasks, updates, and special offers. We are constantly working to improve our platform and add new features, so stay tuned for more exciting news!</p>

    <p>We are a leading task gaming company and we aim to provide the best gaming experience for all task enthusiasts.</p>
    <p>Welcome once again and let's go Gaming!</p>
    
    `);

export const forgetPasswordRequestEmail = (otp?: string) =>
  EmailWrapper(`<p style="font-size: 1.1em">Hello task Gamer,</p>
    <p>
      You made a forget password request.please enter the following One Time Password (OTP) within the next 5 minutes:.
    </p>
      <div class="green-btn">
      ${otp}
      </div>
    <br/>
    <p>Please note that this OTP is only valid for 5 minutes and is for verifying your account. If you did not make this request, please reach out to us immediately.</p>
    <p>We look forward to providing you with the best gaming experience at Olakz.</>
  `);

export const newPasswordEmail = () =>
  EmailWrapper(`<p style="font-size: 1.1em">Hello task Gamer,</p>
     <p> Kindly be informed that your Password has been updated successfully. </p>
     <br/>
     <p>We look forward to providing you with the best gaming experience at Olakz.</>
  `);

export const adminNewPasswordHTML = (createNewPasswordUrl?: string) =>
  EmailWrapper(`<p style="font-size: 1.1em">Hello Admin,</p>
    <p>
      Your admin account has been created successfully.please Use the Link below to create your New Password.
    </p>
    <a
      href="${createNewPasswordUrl}"
      style="
        background: #41917be6;
        display: block;
        margin: 0 auto;
        width: max-content;
        padding: 10 10px;
        font-size: 1rem;
        text-decoration: none;
        color: #fff;
        border-radius: 4px;
        padding: 5px;
      "
    >
      Enter New Password
    </a>
    <br/>
    <p style="font-size:16px;">You can Instead copy the following link on your browser <br/> ${createNewPasswordUrl}</p>`);

export const updatePasswordConfirmationEmail = (username?: string) =>
  EmailWrapper(`<p style="font-size: 1.1em">Hello ${username},</p>
    <p>
      Kindly be informed that your password has been updated successfully, from your gaming dashboard.
    </p>
    <br/>
    <p>If you did not make this request, please reach out to us immediately.</p>
    <p>We look forward to providing you with the best gaming experience at Olakz.</>
  `);

export const signOffEmail = (username?: string) =>
  EmailWrapper(`<p style="font-size: 1.1em">Hello ${username},</p>
    <p>
      It is painful to see you leave the platform. Kindly be informed that we will take your review serious and will be glad to see you rejoin the platform.
    </p>
    <br/>
    <p>If you did not make this request, please reach out to us immediately.</p>
    <p>We look forward to providing you with the best gaming experience at Olakz.</>
  `);
