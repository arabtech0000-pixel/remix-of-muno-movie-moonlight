import { useEffect, useState } from "react";
import { MessageCircle, Radio, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import munoLogo from '@/muno/assets/munno_movies_logo.png';

const dismissalKey = "munomovies-join-dismissed";
const GROUP_URL = "https://chat.whatsapp.com/EfjzgGyIIBJ1i017P0VlAB?s=cl&p=a&mlu=4&ilr=4";
const CHANNEL_URL = "https://whatsapp.com/channel/0029VazB22oEFeXpRzIEEL1q";

export function InstallInvitation() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try { dismissed = sessionStorage.getItem(dismissalKey) === "true"; } catch { /* Storage may be disabled. */ }
    setVisible(!dismissed);
  }, []);

  function dismiss() {
    setVisible(false);
    try { sessionStorage.setItem(dismissalKey, "true"); } catch { /* ok */ }
  }

  return (
    <>
      {visible && !open && <aside className="muno-install fixed z-40 rounded-lg border border-border bg-background p-3 text-foreground" aria-label="Join MunoMovies community">
        <div className="flex items-center gap-3">
          <img src={munoLogo} alt="" width="44" height="44" className="shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">Muno<span className="text-primary">Movies</span></p>
            <p className="text-xs text-muted-foreground">Join us on WhatsApp</p>
          </div>
          <Button size="sm" className="shrink-0" onClick={() => setOpen(true)}><Users />Join</Button>
          <Button variant="ghost" size="icon" className="shrink-0" aria-label="Dismiss" title="Not now" onClick={dismiss}><X /></Button>
        </div>
      </aside>}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="muno-install bg-background text-foreground max-w-sm">
          <img src={munoLogo} alt="" width="72" height="72" className="mx-auto rounded-lg" />
          <DialogTitle className="text-center">Join our social media platforms</DialogTitle>
          <DialogDescription className="text-center">Get instant messages about our new updates and movies.</DialogDescription>
          <Button asChild className="w-full"><a href={GROUP_URL} target="_blank" rel="noopener noreferrer"><MessageCircle />Join WhatsApp Group</a></Button>
          <Button asChild variant="outline" className="w-full"><a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer"><Radio />Follow WhatsApp Channel</a></Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
