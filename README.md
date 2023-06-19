# Shiny app with accessible slider

This is an example app that includes a custom slider that should be accessible to almost all users. The slider is constructed from native, semantic, HTML elements — `input`, `output` and `label` — and we believe this _should_ meet the WCAG 2.1 AA standard. However, it hasn't been independently assessed, so please do let us know if you discover any issues.

We used the article [_Build custom input objects_](https://shiny.posit.co/r/articles/build/building-inputs/) to guide us.

## Running the app

To run the app in R or RStudio simply execute:

``` r
shiny::runApp("app/")
```