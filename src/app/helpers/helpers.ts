
export function  myEncodeURI( sIn, sTarget="") {
  var sTemp = sIn;
  // om 1 of andere reden wordt & niet ge-escaped door encodeURIComponent ...
  // voor encodeURI want die introduceert &'s
  // niet voor last-fm ...
  if (sTarget !== "lastfm")
    while (sTemp.indexOf("&") > -1)	sTemp=sTemp.replace("&", "%26");
  sTemp = encodeURIComponent(sTemp);
  while (sTemp.indexOf("'") > -1)	sTemp=sTemp.replace("'", "%27");
  while (sTemp.indexOf("%E2%80%98") > -1)	sTemp=sTemp.replace("%E2%80%98", "%27");  // deze single quote (&#145;) geeft rare effecten
  while (sTemp.indexOf("%E2%80%99") > -1)	sTemp=sTemp.replace("%E2%80%99", "%27");  // deze single quote (&#146;) geeft rare effecten
  return sTemp;
}