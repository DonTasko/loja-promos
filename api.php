<?php

header("Content-Type: application/json");

$ASINS = ["B0GHNL2SRS", "B0CVB937JQ"];

$payload = [
    "ItemIds" => $ASINS,
    "Resources" => [
        "Images.Primary.Large",
        "ItemInfo.Title",
        "Offers.Listings.Price",
        "Offers.Listings.SavingBasis.Price"
    ],
    "PartnerTag" => "viseu7302-21",
    "PartnerType" => "Associates"
];

echo json_encode($payload); 
