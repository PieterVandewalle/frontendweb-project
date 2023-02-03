const currencyFormat = Intl.NumberFormat("nl-BE",{
    style: "currency",
    currency: "EUR"
})

export const formatCurrency = (value) =>currencyFormat.format(value);