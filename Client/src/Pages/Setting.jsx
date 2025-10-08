import React from "react";
import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Divider,
    IconButton
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function SettingsPage() {
    const settings = [
        {
            section: "General",
            items: [
                { label: "Email address", value: "email@gmail.com" },
                { label: "Phone Number", value: "" },
                { label: "Password", value: "" },
                { label: "Gender", value: "Man" },
                { label: "Location customization", value: "Use approximate location (based on IP)" }
            ]
        },
        {
            section: "Account authorization",
            items: [
                { label: "Google", value: "Disconnect" },
                { label: "Apple", value: "Connect" },
                { label: "Two-factor authentication", value: "" }
            ]
        },
        {
            section: "Advanced",
            items: [
                { label: "Delete account", value: "" }
            ]
        }
    ];

    return (
        <div
            style={{
                padding: "2rem",
                maxWidth: "800px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                minHeight: "100vh", // full screen height
                justifyContent: "flex-start", // change to "center" if you want vertical centering
            }}
        >
            <Typography variant="h4" gutterBottom align="center">
                Settings
            </Typography>

            {settings.map((section, i) => (
                <div key={i} style={{ marginBottom: "2rem" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                        {section.section}
                    </Typography>
                    <List disablePadding>
                        {section.items.map((item, index) => (
                            <React.Fragment key={index}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end">
                                            <ArrowForwardIosIcon fontSize="small" />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={item.label}
                                        secondary={item.value}
                                        primaryTypographyProps={{ fontSize: "0.95rem" }}
                                        secondaryTypographyProps={{
                                            fontSize: "0.85rem",
                                            color: "text.secondary"
                                        }}
                                    />
                                </ListItem>
                                {index < section.items.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </div>
            ))}
        </div>
    );
}
