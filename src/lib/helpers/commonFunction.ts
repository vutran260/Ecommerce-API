const formatCurrency = (amount: number | string | undefined) => {
  if (amount === undefined) {
    return '-';
  }
  return Number(amount).toLocaleString('ja-JP');
};

function formatPhoneNumber(phoneNumber: string | undefined): string {
  // Handle case where phoneNumber is undefined or not a string
  if (!phoneNumber) {
    return '-'; // Return an empty string or handle as needed
  }

  // Ensure the phone number is exactly 11 digits
  if (phoneNumber.length !== 11) {
    throw new Error('Phone number must be exactly 11 digits');
  }

  // Use regular expression to capture the groups and format the phone number
  return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
}

export { formatCurrency, formatPhoneNumber };
