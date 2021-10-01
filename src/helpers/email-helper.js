'use strict';

const { parse } = require('node-html-parser');

module.exports = (requestShareId, hostEmail, fileName) => {

	const root = parse(`
	<!doctype html>
	  <html lang="en-US">
	  
		
	  <head>
		<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
		<title>Reset Password Email Template</title>
		<style type="text/css">
	  
		  .team {
			font-size: 15px; 
			color: "#1C61D1"; 
			line-height: 18px; 
			margin: 0 0 0;
		  }
	  
		  .footer_message {
			color:#455056; 
			font-size:15px;
			line-height:24px;
			margin:0;
		  }
	  
		  .divider {
			display:inline-block; 
			vertical-align:middle; 
			margin:12px 0 12px; 
			border-bottom:1px solid #cecece; 
			width:100px;
		  }
	  
		  body {
			margin: 0px; 
			background-color: #1C61D1;
		  }
	  
		  .card {
			@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); 
			font-family: 'Open Sans', sans-serif;
		  }
	  
		  .card_top{
			background-color: #E9E8EA; 
			max-width:670px;  
			margin:0 auto;
		  }
	  
		  .card_center {
			max-width:670px;
			background:#fff; 
			border-radius:3px; 
			text-align:center;
			-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);
			-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);
			box-shadow:0 6px 18px 0 rgba(0,0,0,.06);
		  }
		  
		  .title {
			color:#1e1e2d; 
			font-weight:500; 
			margin:0;
			font-size:32px;
			font-family:'Rubik',sans-serif;
		  }
	  
		  .invitation {
			color:#1e1e2d; 
			font-weight:500; 
			margin:0;
			font-size:16px;
			font-family:'Rubik',sans-serif;
			padding-top: 30px;
			justify-content: start;
		  }
	  
		  .acceptButton {
			background-color: #2875F2;
			color: #fff;
			margin-top: 30px;
			height: 40px;
			width: 130px;
			font-size: 20px;
			border-radius: 10px;
			border-width: 0px;
		  }
		  
		</style>
	  
	  </head>
	  
	  <body marginheight="0" topmargin="0" marginwidth="0" leftmargin="0">
		<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#1C61D1" class="card">
		  <tr>
			<td>
			  <table class="card_top" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
				<tr>
				  <td style="height:80px;">&nbsp;</td>
				</tr>
				<tr>
				  <td style="height:20px;">&nbsp;</td>
				</tr>
				<tr>
				  <td>
					<table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" class="card_center">
					  <tr>
						<td style="height:40px;">&nbsp;</td>
					  </tr>
					  <tr>
						<td style="padding:0 35px;">
						  <h1 class="title"> Invitación para compartir un archivo </h1>
						  <p class="invitation"> ${hostEmail} quiere compartir el archivo ${fileName} contigo. </p>
						  <a href="http://localhost:8080/api/users/fileShareAcceptRequest/${requestShareId}" target="_blank">
							<input type="button" class="acceptButton" value="Aceptar" />
						  </a>
						</tr>
						<br>
					  </td>
					  <tr>
						<td style="height:40px;">&nbsp;</td>
					  </tr>
					</table>
				  </td>
				  <tr>
					<td style="height:20px;">&nbsp;</td>
				  </tr>
				  <tr>
					<td style="text-align:center;">
					  <p class="team"> &copy; <strong>TDD-Drive</strong></p>
					</td>
				  </tr>
				  <tr>
					<td style="height:80px;">&nbsp;</td>
				  </tr>
			  </table>
			</td>
		  </tr>
		</table>
	  </body>
	  
	  </html>`,
	);

	return root.toString();
};
