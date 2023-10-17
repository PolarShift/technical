const axios = require('axios');
const cheerio = require('cheerio');
const Knwl = require('knwl.js');

// Initialize Knwl.js
const knwl = new Knwl();

// Function to fetch and scrape the webpage
async function scrapeCompanyInfo(email) {
  try {
    // Fetch the webpage using a search query for the email address
    const searchUrl = `https://www.go-data.com${encodeURIComponent(email)}`;
    const response = await axios.get(searchUrl);

    // Load the HTML content of the search results page into Cheerio
    const $ = cheerio.load(response.data);

    // Define the CSS selector for the company information (adjust this based on the actual webpage structure)
    const companyInfoSelector = '.company-info';

    // Extract company information
    const companyInfo = $(companyInfoSelector).text();

    // Use Knwl.js to parse the company information for relevant data
    knwl.init(companyInfo);

    // Extract specific information using Knwl.js plugins
    const addresses = knwl.get('places');
    const phoneNumbers = knwl.get('phones');
    const emails = knwl.get('emails');

    // Output the extracted information
    console.log('Company Address:', addresses);
    console.log('Phone Numbers:', phoneNumbers);
    console.log('Other Email Addresses:', emails);

    // Split the address into columns (Address Line 1, Address Line 2, City, Postal Code)
    const addressParts = companyInfo.match(/^(.*?),\s*(.*?),\s*(.*?)\s*(\d{5})$/);

    if (addressParts) {
      const addressLine1 = addressParts[1].trim();
      const addressLine2 = addressParts[2].trim();
      const city = addressParts[3].trim();
      const postalCode = addressParts[4].trim();

      console.log('Address Line 1:', addressLine1);
      console.log('Address Line 2:', addressLine2);
      console.log('City:', city);
      console.log('Postal Code:', postalCode);
    } else {
      console.error('Failed to split the address.');
      // Handle the error case here, for example, set default values or raise an exception
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the function to initiate the scraping (replace 'email@example.com' with the actual email)
scrapeCompanyInfo('email@example.com');
