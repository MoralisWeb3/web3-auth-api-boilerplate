import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { serviceDescription, serviceName } from './env';

export const setupSwaggerDocs = async (app: INestApplication) => {
  const openApiConfig = new DocumentBuilder()
    .setTitle(serviceName)
    .setDescription(serviceDescription)
    .setVersion('1.0')
    .build();

  const openApiCustomOptions: SwaggerCustomOptions = {
    customSiteTitle: serviceName,
    customCss: `
    .topbar-wrapper img {content:url(\'https://lh3.googleusercontent.com/fife/AAWUweUpOr0CwDHCYeH_STZi9ANPgnzMVdfs--tSfiEO9HM5xguuf8Zxf5GhjRubsWqf96F4_AXUwl0Bln-yydUuiKQlfGzX60Ykb-5ujFO3rqohIPNkakS9Q1DT4v-qJzGicsiDDYqzwATYBFCYA5IKsTAXclbubH7HnJISYlwPV7VDGeVKM-DctUqTitv2m5CcWtc23bwnSwrRdYNVU8aloGNAaNleoiNXXKdpxh2tUcRHFTchxghwoVrXtHaDjPnptVWUp84HSDUoswIPyFBlXUw2O2eUyYUH-xxtAfMbMlT5NP7ph6CuXnWjm4Tgk9ctgnK24JsWJZBq_XSRsOYjwnjVq03aQc1i3BgZNLExKq5_DspL6mgxpcv7vTimwAGI7PGH-6AI8FuUrGybYT6AAs1ra6R8eq2Ow_HMB4-Bi3UZ-ufU70FczETnm4UT_B02Aptk6ARyv6YHVTVnjNUz6Dw0VUA7IxToxEAJHE9VYYMk96SjZsAd-8ktxFnMev7fIG0SN145QHl0ngHw54IHdUB2Dk5G106B0N0F1EevVBAfkW6Sls49SU_ykMtlJX2o1x7BQWs9L00X72w__xRgnl92xyYW7Rjh4pvYVaA08rKebBNFB0nWvRmqcbUX-JBctguGHZTvSqLmvMqn9Wzb0lBcwrEiK1pHV8fl8ST2hUWDQ9Giu7cCbiUz6j--B0z4mqc2cXyhLORO1s9AnaJV4PSU46RcOftvpHvLcipAZQ3KciOXX6eoLXDlIppFjwOe1cDrLnwxC-NVtBPgcJriLk8A3NYETTUZJpQTALquZUdzZ6R6-v7ATxTl4M02axml789lM2gNGLGfafonk9BZR9s6XT_5XtG9dCSd8qhiF0S0hPk9sLj8s6YRde8Fi_BF1nCHlSG7HA35iIRzKzYa8bNpEX1qWkKxxC8MZOE_swTZ8zW-ubL8xXmkvVzYsijTZ5Y4wGlG4PlMDTUV1jSd2_gd8FuUOdwTZN3r2Xwc6cj46p1wXBWQPO4Bpb7OazMvT6lPTj5yzgGJbwLx01wwhpFpLU-uEhJ_6cd3924irI5B8_H0QJ7n7qYZ6TjipcefrP_hfBymGFLLv6luq1xLvwhHtWolrjoZgmENbPOrRxN0oorMxvvX9qgob24uD_b0AroBuZsWVW_AsV92Q6lzZwWVwYP7KPrHUdzzKbd4fQXAK7crkLj_UZFvnUJySLTEuDtDL26U14eFXAt2XpSOpsMYn53PvMePAVWxFMxeWxpjLNOorMxgGEZYuAdJ8J1_bYk5llvaGwlnEMflZcMJRdeKE3Ig_KkNZ0A-o5YAIcUM=w3840-h1149\'); height:50px; width:auto;}
     `,
    uiConfig: {
      displayOperationId: true,
    },
  };

  const swaggerDoc = SwaggerModule.createDocument(app, openApiConfig);
  SwaggerModule.setup('api-docs', app, swaggerDoc, openApiCustomOptions);
};
