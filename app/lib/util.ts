
/* removes all non-alphanumeric chars */
export function strip(toStrip: string):string{
	return toStrip.replace(/[\W_]+/g, '');
}

export function logoToArtistCamel(logo: string):string{
	return logo.substring(logo.lastIndexOf('/')+1).replace(/Logo.+/g, '');
}