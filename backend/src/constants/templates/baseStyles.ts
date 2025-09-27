export const baseStyles = `
  <style>
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
      background: #ffffff;
    }
    .otp-container {
      background: #f8f9ff;
      border: 2px dashed #667eea;
      border-radius: 12px;
      padding: 25px;
      text-align: center;
      margin: 25px 0;
    }
    .otp-code {
      font-size: 32px;
      font-weight: bold;
      color: #667eea;
      letter-spacing: 4px;
      font-family: 'Courier New', monospace;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      transition: transform 0.2s;
    }
    .button:hover {
      transform: translateY(-2px);
    }
    .alert-box {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .success-box {
      background: #d1edff;
      border-left: 4px solid #0084ff;
      padding: 15px 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px 30px;
      text-align: center;
      color: #666;
      font-size: 14px;
      border-radius: 0 0 8px 8px;
    }
    .social-links {
      margin: 15px 0;
    }
    .social-links a {
      display: inline-block;
      margin: 0 10px;
      color: #667eea;
      text-decoration: none;
    }
    .security-tip {
      background: #e8f4ff;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
      font-size: 14px;
    }
  </style>
`;
