import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Grid, Typography, Card, CardContent, CircularProgress } from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';


function Statistics() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Grouping events by category
    const getEventStatsByCategory = () => {
        const eventStats = events.reduce((acc, event) => {
            acc[event.category] = (acc[event.category] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(eventStats).map((key) => ({ category: key, count: eventStats[key] }));
    };
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/v1/events/events-organizer', {
                        headers: {
                        Authorization: `Bearer ${Cookies.get("jwt")}`,
                    },
                    credentials: "include",
                });
                const { data } = await response.json();
                setEvents(data.events);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography>Error: {error}</Typography>;
    }

    const eventStatsbByCategory = getEventStatsByCategory();
    const seriesData = eventStatsbByCategory.map((item, index) => ({
        id: index,
        value: item.count,
        label: item.category,
    }));
    seriesData.sort((a, b) => b.value - a.value);

    //const ticketSales = getTicketSalesByDay();

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                    נתונים וסטטיסטיקה
                </Typography>
            </Grid>

            <Grid item xs={12} md={60}>
                <Card>
                    <CardContent>
                        <Typography variant="h7">האירועים שלי בחלוקה לקטגוריות</Typography>
                        <Grid item xs={12} md={60}>
                            <PieChart
                                series={[
                                    {   
                                        data: seriesData,
                                        innerRadius: 10,
                                        paddingAngle: 2,
                                        cornerRadius: 2,
                                        highlightScope: { faded: 'global', highlighted: 'item' },
                                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                        cx:150,
                                    },
                                ]}
                                width={600}
                                height={260}
                                sx={{ direction: "ltr" }}
                            />  
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            {/* <Grid item xs={12} md={60}>
                <Card>
                    <CardContent>
                        <Typography variant="h7">כרטיסים שנמכרו בחלוקה לימים</Typography>
                        <Grid item xs={12} md={60}>
                            
                        </Grid>
                    </CardContent>
                </Card>
            </Grid> */}
        </Grid>
    );
}

export default Statistics;
