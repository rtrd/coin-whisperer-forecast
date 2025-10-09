export const setAddressInStorage = (address: string) => {
    localStorage.setItem('walletAddress', address)
}
export const getAddressFromStorage = () => {
   return localStorage.getItem('walletAddress') ?? null;
}
export const removeAddressFromStorage = () => {
    localStorage.removeItem('walletAddress');
 }