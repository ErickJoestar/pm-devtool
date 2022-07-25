// ********************************************************************************
/**
 * Appends '//' whenever the link entered by the user does not contain an already defined
 * HTTP-protocol URL. This has to be done since otherwise the application redirects to
 * the local domain (e.g. notebook/something)
 * @param linkInput The input given by the user as the href for this link
 * @returns Either the input without modifications if it includes 'http', or the
 * input with an appended '//' at the beginning if it doesn't
 */
export const sanitizeLinkInput = (linkInput: string): string => linkInput.includes('http')
    ? linkInput
    : '//' + linkInput;
