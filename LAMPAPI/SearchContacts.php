<?php

// Allowed origins
$allowed_origins = [
    "http://cop4331-project.xyz",
    "http://www.cop4331-project.xyz",
    "https://cop4331-project.xyz",
    "https://www.cop4331-project.xyz"
];

// Check the request origin
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Allow the request if it matches
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $origin);
}

// Standard CORS headers
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Stop here for preflight checks
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else 
	{
		// Append wildcards to the search string for partial matching
		$searchString = "%" . $inData["search"] . "%";
		
		$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?) AND UserID=?");
		$stmt->bind_param("ssssi", $searchString, $searchString, $searchString, $searchString, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		$resultsArray = array();
		while($row = $result->fetch_assoc())
		{
			$resultsArray[] = $row;
		}
		
		if( count($resultsArray) == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $resultsArray );
		}
		
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"results":[],"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":' . json_encode($searchResults) . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>