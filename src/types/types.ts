import React from "react";
import { ThemeProps } from "styled-components";
import { SpacingProps } from "@material-ui/system";
import { Theme } from "@material-ui/core";

export type GlobalStyleProps = {
    theme: ThemeProps<Theme> & {body: any}
}

export interface MuiButtonSpacingType extends SpacingProps {
    component: React.PropsWithoutRef<{}>
    to?: string

}
export interface MuiChipSpacingType extends SpacingProps {
    component?: React.PropsWithoutRef<{}>
    href?: string
    icon?: JSX.Element | null
}

// Routes
export type RouteInfoType = {
    id: string
    path: string
    icon?: JSX.Element
    children: null | Array<ChildElementType>
    component: React.ComponentClass<any> | null
    badge?: string | number
    containsHome?: boolean
    open?: boolean
    header?: string
    childrenNotVisibleInSidebar?: Array<ChildElementType>
    externalLink?: boolean
}

export type ChildElementType = {
    path: string
    name: string
    component: React.ComponentClass<any>
    icon?: JSX.Element
    badge?: string | number
}

export enum APP_ID {
    clixlogix-samplecode = 'jrx.clixlogix-samplecode',
    SOLITAIRE = 'onclixlogix-samplecode.solitaire',
    SOLITAIRE_CRYPTO = 'onclixlogix-samplecode.jrxsolitaireblitz',
    TENNIS_CHAMPS = 'onclixlogix-samplecode.tennischamps',
    SHEEP_CLASH = 'onclixlogix-samplecode.sheepclash',
    TONK_BATTLER = 'onclixlogix-samplecode.tonkbattler',
    WORDPLAY = 'onclixlogix-samplecode.wordplay',
    TRIVIA_BLITZ = 'onclixlogix-samplecode.trivia',
    BATTLE_CHAMPS = 'onclixlogix-samplecode.battlechamps',
    TANK_WARS = 'onclixlogix-samplecode.tankwars',
    MATCH = 'onclixlogix-samplecode.match',
    BUBBLE = 'onclixlogix-samplecode.bubble',
    MUSIC_MANIA = 'onclixlogix-samplecode.musicmania',
}  

export type TUserGoogleProfile = {
    email: string
    familyName: string
    givenName: string
    googleId: string
    imageUrl: string
    name: string
}

export type TDispatcherOptions = {
    success?: Function;
    error?: Function;
}

export enum EVirtualCurrencyTypes {
    COIN = 'COIN',
    TICKET = 'TICKET',
  }
