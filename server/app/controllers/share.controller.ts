import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Share } from "../models/ShareModel";
import { Content } from "../models/ContentModel";

export const PostshareOn = async (req: Request, res: Response): Promise<void> => {
    try {
        const myUniqueID = uuidv4();
        const alreadyShared = await Share.findOne({ createdBy: req.id });
        if (!alreadyShared) {
            await Share.create({
                slug: myUniqueID,
                isSharing: true,
                createdBy: req.id,
            });
            res.status(201).json({ slug: myUniqueID, isSharing: true });
        } else {
            res.status(409).send("Already Shared");
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

export const GetshareOn = async (req: Request, res: Response): Promise<void> => {
    try {
        const alreadyShared = await Share.findOne({ createdBy: req.id });
        if (alreadyShared) {
            res.status(201).json({
                isSharing: alreadyShared.isSharing,
                slug: alreadyShared.slug
            });
        } else {
            res.status(404).json({
                isSharing: false,
                message: "No active share found"
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

export const PostShareOff = async (req: Request, res: Response): Promise<void> => {
    try {
        await Share.deleteMany({ createdBy: req.id });
        res.status(200).json({ isSharing: false });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const GetShareId = async (req: Request, res: Response): Promise<void> => {
    try {
        const shared = await Share.findOne({ slug: req.params.id });
        if (!shared) {
            res.status(404).json({
                error: "Share link not found or has expired"
            });
            return;
        }

        const contents = await Content.find({ createdBy: shared.createdBy });
        if (!contents.length) {
            res.status(404).json({
                error: "No content available for this share"
            });
            return;
        }

        res.status(200).json({
            owner: shared.createdBy,
            contents: contents
        });
    } catch (error) {
        console.error('Share retrieval error:', error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};