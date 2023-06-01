# Receipt Processing API Documentation

This README file provides documentation for the Receipt Processing API. The API allows users to process receipts, retrieve information about the processed receipts, and obtain points associated with a particular receipt.

## Endpoints

### Process Receipt

- Path: /receipts/process
- Method: POST

This endpoint is used to process a receipt and store it in the system. The request should include the following data in JSON format:
```
{
    "retailer": "Target",
    "purchaseDate": "2022-01-02",
    "purchaseTime": "13:13",
    "total": "1.25",
    "items": [
        {
            "shortDescription": "Pepsi - 12-oz",
            "price": "1.25"
        }
    ]
}
```
The response will include the ID of the processed receipt:
```
{
    "id": "1a506c3c-967a-4800-86c4-5812bcb7e32e"
}
```
### Retrieve Points for Receipt

- Path: /receipts/{id}/points
- Method: GET

This endpoint allows users to retrieve the points associated with a specific receipt. Replace {id} in the path with the ID of the receipt.

The response will include the number of points earned for the receipt:
```
{
    "points": 31
}
```
## Usage

To use the Receipt Processing API, follow the instructions below:

1. Clone the repository and navigate to the project directory.
2. Install the required dependencies.
    ### Docker
      - Assuming you have docker, run the following command in terminal to make a image
      ```
      docker build -t fetch-receipt-processor .
      ```
    
     - Run the container on port 3000. 
     ```
     docker run -p 3000:3000 fetch-receipt-processor
     ```

3. The Receipt Processing API is now running. You can send requests to the specified endpoints using your preferred HTTP client.

