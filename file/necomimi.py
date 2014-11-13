import thinkgear
PORT = '/dev/tty.usbserial-A800JZQ1'
f = open("data","w")
for packets in thinkgear.ThinkGearProtocol(PORT).get_packets():
    for p in packets:
        if isinstance(p, thinkgear.ThinkGearRawWaveData):
            continue
        print p
        f.write(str(p))
f.close()