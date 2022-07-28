<p align="center">
<a  href="https://moralis.io/"  target="blank"><img  src="https://lh3.googleusercontent.com/fife/AAWUweVoQvbHEznFr4NnSyqUqTYduklV2LKygrelaD6K5-6jUt1eKVol3VZGSAGNt4m13HLKFM0CjowxtUbSWiqsCEskZ2dLAlt8vf8U1nkNYpq308x8H6ZnxRyMtoTR2PP3j-LoUOcnrO41mPn9N2BHddduEdCkhTH0755BhlhTTDk0w51vhfuusJe-FWY2mCqj2nJnvNz_rirc-PYnaYIuFkL2Q9h2DAIJomzuVyQN7dZdiPOAfyn89MG4neNBXoBKsV21CCaqBLKZZ9_aGKcMBNmEQ_RzbWcgPmfQsAdS3cz_ZqW13E6RHWjRqUcq-42Vezr_ar8DOYKcJhqA_cHogYoTM0JaciIO8qhJaLpLyU5tgOUnqEJCUHdHw9XRuWYLzfPk0siZfrnoiEmGU8PlsCohQtvZEt3TSRP55zVM5o_pelJ1mSTRIHECttYI8HhuPcAfn1BMHEdoUpAN8F3loG5LalulLpabH2XJOjyrb01kh9XXjiHKUhw5J3XlbJp2ZBWsW2zQEZ2Z82LDlFcDu0ppcSQCPrUVrPwiQR7pJgS5oVoNVN755s5WBCcdxlL5BjYhrTcH8ZNPtU7y9H8keNd775n9d8rxVjrer4JgZa377GN_MA-mztKMrxJ2XzaGK0R0qklaTLfK1Zcxox0tm1yvNVeafTkbBL4o1uyjN5zuR7QqKx4c-EId-LPaa0uiquHO5HZi4TexQ7BhKA_HOt6VIsSRjh67OxOy2Iw2iuV4bisNCznmfQcSrwKBvI4GY6QCvJGbFFNtyujYwske9lYZQApXgO2QNOSw9N9WscfCYclCEp-irS9qjJC9l-elwkT_CEqEbOIbaG2Coo8pUGYgcokHncSfIkWx_GSfj3V35V3GI2grS_wzgItY3WoEubqI3rpixdUTaeR4RwPIrn7G_m8qmj9EmTHFJGIV7Fs-gR8sBwiBWnjM0JqKWm1m3Q9bjYmlCtg2zeMyZsRj7OxEXN3OZWIjon3CXCFAa7pz3AiSZY7MvykdSbbiCyh-TUR91tVSJy50DRuZA2Y_V6qFM--mm-w_TTC2eOphKowsHguNhzmBJcXuzrwALGFb1NgHwcq8bfll7piFa365dM0MyQMGGzFdJ-TCoazzycc5tbBTO_9isLU5xVixUUhThyErUm16maZbt8filTpF3zzL0J8MnqY3Hoe_vQiEfQ57Du5S_5ZZht6Uf8ViVC16P57NCDXg6eZSeh2HHYptlFt95elCLhHduiHoBbPbdvbmdWeScftYXGbNXNKv0BxxJrnv4G3MaxNw8jfa6FI2i3T-0qupk0tJSzGD8rxJd9Qy=w3840-h2070" width="120" alt="Moralis Logo" /></a>
</p>

  
# Moralis Auth API Boilerplate Application

## Description
This document explains the step by step guide on setting up the Moralis Auth API Boilerplate Application.
Auth Demo Application contains of 2 layers of application:
1) Frontend Application
* To sign in/sign up web2 user
* To sign in/sign up web3 user
* To link existing web2 user with web3 wallet address
* To view NFTs of web3 user
2) Backend Application
* To sign in/sign up web2 user
* To sign in/sign up web3 user
* To link existing web2 user with web3 wallet address
* To generate authentication token to authenticate frontend user
* To fetch wallet addresses NFTs

# Setup guide

## :framed_picture: Frontend Application
1) Run `cd frontend` to enter the frontend folder
2) Rename `.env.example` to `.env`.
3) In `.env`, configure `REACT_APP_MORALIS_APP_ID` and `REACT_APP_MORALIS_SERVER_URL` (Create Dapp and Obtain key [here](https://admin.moralis.io/dapps)).
4) Run `npm install`.
5) Run `npm run start`.

## :gear: Backend Application
1) Run `cd frontend` to enter the frontend folder
2) Rename `.env.example` to `.env`.
3) Make sure your local docker environment is up and running ([Download Docker](https://docs.docker.com/get-docker/)).
4) Run `npm run dev:up` to spin up docker images.
5) In `.env`, configure `MORALIS_WEB3_API_KEY` (Obtain the key [here](https://admin.moralis.io/web3apis))
6) Run `npm install`.
7) Run `npm run start:dev`.

# References
[Moralis Auth API Endpoints](https://authapi.moralis.io/api-docs)
