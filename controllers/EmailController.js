import { createTransport } from 'nodemailer';
import { PDFDocument, rgb, degrees} from 'pdf-lib'
import fs from "fs"
import path from "path"
import { resolve } from 'path';
import fontkit from '@pdf-lib/fontkit'
const generatePDF = async (name) => {
    const existingPdfBytes = fs.readFileSync('./public/certificate/certificate.pdf')
    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);
    //get font
    const fontBytes = fs.readFileSync('./public/font/Lucian-Schoenschrift-CAT.ttf')
    // Embed our custom font in the document
    const SanChezFont  = await pdfDoc.embedFont(fontBytes);
    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    
    // Draw a string of text diagonally across the first page
    firstPage.drawText(name, {
        x: 120,
        y: 400,
        size: 58,
        font: SanChezFont ,
        color: rgb(0, 0, 0),
    });
    
    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfDataUri = await pdfDoc.saveAsBase64();
    return pdfDataUri
}
export const reviewCertificate= async(req,res)=>{
    const {email,reviewer} =req.body
    const transporter = createTransport({
        service: 'gmail', // Use Gmail as the email service
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL, // Your Gmail email address
          clientId: process.env.CLIENT_ID, // OAuth 2.0 client ID
          clientSecret: process.env.CLIENT_SECRET, // OAuth 2.0 client secret
          refreshToken: process.env.OAUTH_REFRESH_TOKEN // OAuth 2.0 refresh token
        }
      });
      const certificate = await generatePDF(reviewer)
      // Define the email options
      const mailOptions = {
        from: process.env.EMAIL, // Sender's email address
        to: email, // Recipient's email address
        subject: 'Review Submitted', // Subject line
        text: `${reviewer}\n
        Thank you for completing the review of this submission. Your review has been submitted successfully. We appreciate your contribution to the quality of the work that we publish\n
        Here is your review certificate for our appreciation: `,
        attachments: [
            {   // binary buffer as an attachment
                filename: 'Certificate.pdf',
                content: certificate,
                encoding: 'base64'
            },
        ]
      };
    try {
        const info = transporter.sendMail(mailOptions)
        res.status(200).json("Message sent");
    } catch (error) {
        res.status(500).json(error.message);
    }
}
// Create a transporter object
export const answerSubmission= async(req,res)=>{
    const {email,author,subtitle,title,decision,journal} =req.body
    const transporter = createTransport({
        service: 'gmail', // Use Gmail as the email service
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL, // Your Gmail email address
          clientId: process.env.CLIENT_ID, // OAuth 2.0 client ID
          clientSecret: process.env.CLIENT_SECRET, // OAuth 2.0 client secret
          refreshToken: process.env.OAUTH_REFRESH_TOKEN // OAuth 2.0 refresh token
        }
      });
      
      // Define the email options
      const mailOptions = {
        from: process.env.EMAIL, // Sender's email address
        to: email, // Recipient's email address
        subject: 'Submission Decision', // Subject line
        text: `${author}
        \nWe have reached a decision regarding your submission to ${journal}, "${title}: ${subtitle}".
        \nOur decision is to: ${decision}`
      };
    try {
        const info = transporter.sendMail(mailOptions)
        res.status(200).json("Message sent");
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const inviteReviewer= async(req,res)=>{
    const {email,subtitle,title,editor_name,editor_email,website,due_date} =req.body
    const transporter = createTransport({
        service: 'gmail', // Use Gmail as the email service
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL, // Your Gmail email address
          clientId: process.env.CLIENT_ID, // OAuth 2.0 client ID
          clientSecret: process.env.CLIENT_SECRET, // OAuth 2.0 client secret
          refreshToken: process.env.OAUTH_REFRESH_TOKEN // OAuth 2.0 refresh token
        }
      });
      
      // Define the email options
      const mailOptions = {
        from: process.env.EMAIL, // Sender's email address
        to: email, // Recipient's email address
        subject: 'Review Manuscript', // Subject line
        text: `I believe that you would serve as an excellent reviewer of the manuscript, '${title}: ${subtitle},' which has been submitted to Test Journal. The submission's abstract is inserted below, and I hope that you will consider undertaking this important task for us. 
        \nPlease log into the journal web site to indicate whether you will undertake the review or not, as well as to access the submission and to record your review and recommendation. The web site is ${website}
        \nThe review itself is due ${due_date}.
        \nThank you for considering this request. 
        \n${editor_name} 
        \n${editor_email}`
      };
    try {
        const info = transporter.sendMail(mailOptions)
        res.status(200).json("Message sent");
    } catch (error) {
        res.status(500).json(error.message);
    }
}
