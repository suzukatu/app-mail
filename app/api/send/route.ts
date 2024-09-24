import { EmailTemplate } from "@/components/email-template";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    //const { username, subject, email, content, file } = await request.json();

    const fromData = await request.formData();

    const username = fromData.get("username") as string;
    const email = fromData.get("email") as string;
    const subject = fromData.get("subject") as string;
    const content = fromData.get("content") as string;
    const file = fromData.get("file") as File;

    const buffer = Buffer.from(await file.arrayBuffer());
    //console.log(buffer);

    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: ["katu.k.suzuki@gmail.com"],
            subject: subject,
            react: EmailTemplate({
                username,
                email,
                content,
            }) as React.ReactElement,
            attachments: [{ filename: file.name, content: buffer }]
        })
        if (error) {
            return NextResponse.json({ error });
        }
        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error })
    }
}