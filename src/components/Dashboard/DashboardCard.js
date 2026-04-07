import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { motion } from "framer-motion";

import "./dashboard.css";

const DashboardCard = ({ icon, title, description, buttonText, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ height: "100%" }}
    >
      <Card className="cardCustom">
        <CardContent className="cardContentCustom">

          <Box className="cardTop">
            {icon}

            <Typography variant="h6" mt={2}>
              {title}
            </Typography>

            {description && (
              <Typography color="text.secondary">
                {description}
              </Typography>
            )}
          </Box>

          {buttonText && (
            <Box className="cardBottom">
              <Button onClick={onClick}>
                {buttonText}
              </Button>
            </Box>
          )}

        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardCard;