import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import './InfoBox.css';

function InfoBox({ title, cases, isRed, isOrange, active, total, ...props }) {
    return (
        <Card onClick={props.onClick} 
            className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"} ${isOrange && "infoBox--orange"}`}>
            <CardContent>
                {/* Title */}
                <Typography color="textSecondary" className="infoBox__title">
                    {title}
                </Typography>

                {/* Number of Cases */}
                <h2 className={`infoBox__cases ${!isRed && !isOrange && "infoBox__cases--green"} ${!isRed && isOrange && "infoBox__cases--orange"}`}>{cases}</h2>

                {/* Total Cases */}
                <Typography color="textSecondary" className="infoBox__total">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
