library("shiny")
library("ggplot2")
library("dplyr")
library("glue")


accessibleSlider = function(inputId, label, value = 0, min = 0, max = 100, step = 1) {
  ticks = labeling::wilkinson(min, max, 5)
  
  listId = glue("list-{inputId}")
  outputId = glue("output-{inputId}")
  
  tagList(
    singleton(tags$head(
      tags$link(rel = "stylesheet", type = "text/css", href = "accessible-slider.css"),
      tags$script(src = "accessible-slider.js")
    )),
    tags$div(
      class = "accessible-slider-container",
      tags$label("for" = inputId, label),
      tags$div(
        tags$input(
          id = inputId,
          type = "range",
          value = value,
          min = min,
          max = max,
          step = step,
          list = listId,
          class = "accessible-slider"
        ),
        tags$datalist(
          id = listId,
          lapply(
            ticks,
            function(t) { tags$option(value = t, label = t) }
          )
        ),
        tags$output(
          id = outputId,
          "for" = inputId,
          value
        )
      )
    )
  )
}


ui = fluidPage(
  titlePanel(tags$h1("Diamonds data"), "Diamonds data"),
  sidebarPanel(
    selectInput("clarity", "Clarity", levels(diamonds$clarity), selectize = FALSE),
    accessibleSlider(
      inputId = "price",
      label = "Maximum price ($)",
      min = 0,
      max = 20000,
      step = 1000,
      value = 5000
    )
    #sliderInput("price", "Max price ($)", min = 0, max = 20000, step = 1000, value = 10000)
  ),
  mainPanel(
    plotOutput("plot"),
  )
)


server <- function(input, output, session) {
  output$plot = renderPlot({
    data = filter(diamonds, clarity == input$clarity & price <= input$price)

    title = glue("{input$clarity} diamonds under ${input$price}")

    backgroundColour = "#AAAAAA"

    ggplot(data) +
      geom_point(
        size = 4,
        aes(x = carat, y = price, colour = cut, shape = cut)
      ) +
      scale_colour_brewer(palette = "YlOrRd") +
      ylab("Price ($)") +
      labs(
        x = "Carats",
        y = "Price ($)",
        title = title,
        colour = "Cut",
        shape = "Cut",
        alt = "Good dynamic alt text should go here"
      ) +
      theme(
        text = element_text(size = 14, colour = "black"),
        panel.background = element_rect(fill = backgroundColour),
        legend.key = element_rect(fill = backgroundColour)
      )
  })
}

shinyApp(ui = ui, server = server)
