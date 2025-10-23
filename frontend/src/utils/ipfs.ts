import axios from 'axios';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY!;
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY!;
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT!;

export interface IPFSUploadResult {
  success: boolean;
  ipfsHash?: string;
  ipfsUrl?: string;
  error?: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

/**
 * Upload a file to IPFS via Pinata
 */
export async function uploadFileToIPFS(file: File): Promise<IPFSUploadResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
      name: file.name,
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', options);

    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data`,
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      }
    );

    const ipfsHash = res.data.IpfsHash;
    return {
      success: true,
      ipfsHash,
      ipfsUrl: `ipfs://${ipfsHash}`,
    };
  } catch (error: any) {
    console.error('Error uploading file to IPFS:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload file to IPFS',
    };
  }
}

/**
 * Upload JSON metadata to IPFS via Pinata
 */
export async function uploadJSONToIPFS(json: NFTMetadata): Promise<IPFSUploadResult> {
  try {
    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      json,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      }
    );

    const ipfsHash = res.data.IpfsHash;
    return {
      success: true,
      ipfsHash,
      ipfsUrl: `ipfs://${ipfsHash}`,
    };
  } catch (error: any) {
    console.error('Error uploading JSON to IPFS:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload JSON to IPFS',
    };
  }
}

/**
 * Complete NFT upload process:
 * 1. Upload image/document file to IPFS
 * 2. Create metadata JSON with IPFS image link
 * 3. Upload metadata JSON to IPFS
 * 4. Return metadata IPFS URL (this is the Token URI)
 */
export async function uploadNFTToIPFS(
  file: File,
  name: string,
  description: string,
  attributes?: Array<{ trait_type: string; value: string | number }>
): Promise<IPFSUploadResult> {
  try {
    // Step 1: Upload file
    const fileUpload = await uploadFileToIPFS(file);
    if (!fileUpload.success || !fileUpload.ipfsUrl) {
      return fileUpload;
    }

    // Step 2: Create metadata
    const metadata: NFTMetadata = {
      name,
      description,
      image: fileUpload.ipfsUrl,
      attributes: attributes || [],
    };

    // Step 3: Upload metadata
    const metadataUpload = await uploadJSONToIPFS(metadata);
    return metadataUpload;
  } catch (error: any) {
    console.error('Error in complete NFT upload:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload NFT to IPFS',
    };
  }
}

/**
 * Get IPFS gateway URL for viewing
 */
export function getIPFSGatewayUrl(ipfsUrl: string): string {
  if (ipfsUrl.startsWith('ipfs://')) {
    const hash = ipfsUrl.replace('ipfs://', '');
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }
  return ipfsUrl;
}

/**
 * Fetch metadata from IPFS
 */
export async function fetchMetadataFromIPFS(tokenURI: string): Promise<NFTMetadata | null> {
  try {
    const url = getIPFSGatewayUrl(tokenURI);
    console.log('Fetching metadata from:', url);
    
    const response = await axios.get(url, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'application/json',
      }
    });
    
    console.log('Metadata response:', response.data);
    
    if (!response.data) {
      console.error('Empty metadata response');
      return null;
    }
    
    // Validate that we have at least a name or image
    if (!response.data.name && !response.data.image) {
      console.error('Invalid metadata structure:', response.data);
      return null;
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching metadata from IPFS:', error.message || error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return null;
  }
}
