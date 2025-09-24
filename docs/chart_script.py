import plotly.graph_objects as go
import pandas as pd

# Data from the user
data = [
    {"tier": "Top 10", "beginner": 6, "intermediate": 3, "advanced": 1, "total": 10},
    {"tier": "Top 20", "beginner": 7, "intermediate": 12, "advanced": 1, "total": 20},
    {"tier": "Top 50", "beginner": 9, "intermediate": 25, "advanced": 16, "total": 50},
    {"tier": "Top 100", "beginner": 13, "intermediate": 34, "advanced": 53, "total": 100}
]

df = pd.DataFrame(data)

# Create stacked bar chart
fig = go.Figure()

# Add bars for each difficulty level using brand colors
fig.add_trace(go.Bar(
    name='Beginner',
    x=df['tier'],
    y=df['beginner'],
    marker_color='#1FB8CD',  # Strong cyan
    text=df['beginner'],
    textposition='inside',
    textfont=dict(color='white', size=12)
))

fig.add_trace(go.Bar(
    name='Intermediate', 
    x=df['tier'],
    y=df['intermediate'],
    marker_color='#2E8B57',  # Sea green
    text=df['intermediate'],
    textposition='inside',
    textfont=dict(color='white', size=12)
))

fig.add_trace(go.Bar(
    name='Advanced',
    x=df['tier'],
    y=df['advanced'], 
    marker_color='#DB4545',  # Bright red
    text=df['advanced'],
    textposition='inside',
    textfont=dict(color='white', size=12)
))

# Update layout
fig.update_layout(
    title='React Questions Difficulty by Tier',
    xaxis_title='Tier',
    yaxis_title='Questions',
    barmode='stack',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Update traces
fig.update_traces(cliponaxis=False)

# Save as PNG and SVG
fig.write_image('react_interview_chart.png')
fig.write_image('react_interview_chart.svg', format='svg')

fig.show()