import { DefaultSession } from "next-auth";

export function UserCard( { user } : { user: DefaultSession["user"]}) {
    
    return (
        <div className="flex items-center mr-2">
            <div className="flex flex-row gap-x-1">
                <p>hello</p>
                <p className="font-semibold">{user?.email}</p>
            </div>
        </div>
    )
}