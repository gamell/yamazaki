//
//  PCPhotosCollectionViewController.m
//  Phochat
//
//  Created by Daniel Koh on 4/23/15.
//  Copyright (c) 2015 Carunaga. All rights reserved.
//

#import "PCPhotosCollectionViewController.h"
#import "SimpleCam.h"
#import <Parse/Parse.h>
#import "PCPhotoCollectionViewCell.h"
#import <MBProgressHUD/MBProgressHUD.h>
#import <SDWebImage/UIImageView+WebCache.h>
#import "UIImageView+Magnify.h"

#define ParsePhotoIdentifier @"UserPhoto"

@interface PCPhotosCollectionViewController ()<SimpleCamDelegate>
@property NSArray *photos;
@property NSTimer *timer;
@end

@implementation PCPhotosCollectionViewController

static NSString * const reuseIdentifier = @"photoCell";

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self reloadPhotos:YES];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    if (self.timer)
    {
        [self.timer invalidate];
        self.timer = nil;
    }
    self.timer = [NSTimer scheduledTimerWithTimeInterval:10 target:self selector:@selector(reloadPhotosWithTimer:) userInfo:nil repeats:YES];
}

- (void)viewWillDisappear:(BOOL)animated
{
    if (self.timer)
    {
        [self.timer invalidate];
        self.timer = nil;
    }
    [super viewWillDisappear:animated];
}

- (void)reloadPhotosWithTimer:(id)_
{
    [self reloadPhotos:NO];
}

- (void)reloadPhotos:(BOOL)withLoading
{
    PFQuery *query = [PFQuery queryWithClassName:ParsePhotoIdentifier];
    if (self.eventId)
    {
        [query whereKey:@"eventIdentifier" equalTo:self.eventId];
    }
    __weak PCPhotosCollectionViewController *weakSelf = self;
    if (withLoading)
    {
        [MBProgressHUD showHUDAddedTo:self.view animated:YES];
    }
    
    [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:YES];
    
    [query findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {
        if (withLoading)
        {
            [MBProgressHUD hideHUDForView:weakSelf.view animated:YES];
        }
        [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:YES];
        if (!error)
        {
            weakSelf.photos = objects;
            [weakSelf.collectionView reloadData];
        }
        else
        {
            NSLog(@"Error in loading photos: %@ %@", error, [error userInfo]);
        }
    }];
    
}

- (IBAction)didTapPhotosButton:(id)sender
{
    SimpleCam * simpleCam = [[SimpleCam alloc]init];
    simpleCam.delegate = self;
    simpleCam.disablePhotoPreview = YES;
    [self presentViewController:simpleCam animated:YES completion:nil];
}

- (void)simpleCam:(SimpleCam *)simpleCam didFinishWithImage:(UIImage *)image {
    
    if (image) {
        NSData *imageData = UIImageJPEGRepresentation(image, 0.3);
        PFFile *imageFile = [PFFile fileWithName:@"test-image.png" data:imageData];
        
        PFObject *userPhoto = [PFObject objectWithClassName:ParsePhotoIdentifier];
        userPhoto[@"imageName"] = @"Some name";
        userPhoto[@"imageFile"] = imageFile;
        userPhoto[@"eventIdentifier"] = self.eventId ?: @"event-id";
        if ([PFUser currentUser])
        {
            userPhoto[@"user"] = [PFUser currentUser];
        }
        __weak PCPhotosCollectionViewController *weakSelf = self;
        [userPhoto saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
            if (!error)
            {
                [weakSelf reloadPhotos:YES];
            }
            else
            {
                NSLog(@"Error in saving photos: %@ %@", error, [error userInfo]);
            }
        }];
    }
    else {
        NSLog(@"SimpleCam is cancelled ");
    }
    
    // Close simpleCam - use this as opposed to dismissViewController: to properly end photo session
    [simpleCam closeWithCompletion:^{
        NSLog(@"SimpleCam is done closing ... ");
        // It is safe to launch other ViewControllers, for instance, an editor here.
    }];
}

- (void) simpleCamNotAuthorizedForCameraUse:(SimpleCam *)simpleCam
{
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"No camera" message:@"Not authorized" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
    [alert show];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

#pragma mark <UICollectionViewDataSource>

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    return 1;
}


- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return self.photos.count;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    PCPhotoCollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:reuseIdentifier forIndexPath:indexPath];
    PFObject *object = self.photos[indexPath.row];
    PFFile *file = object[@"imageFile"];
    [cell.photo sd_setImageWithURL:[NSURL URLWithString:[file url]]];
    return cell;
}

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
    PCPhotoCollectionViewCell *cell = (PCPhotoCollectionViewCell *)[collectionView cellForItemAtIndexPath:indexPath];
    UIImageView *imageView = cell.photo;
    [imageView showAsFullScreenInViewController:self];
}



#pragma mark <UICollectionViewDelegate>

/*
// Uncomment this method to specify if the specified item should be highlighted during tracking
- (BOOL)collectionView:(UICollectionView *)collectionView shouldHighlightItemAtIndexPath:(NSIndexPath *)indexPath {
	return YES;
}
*/

/*
// Uncomment this method to specify if the specified item should be selected
- (BOOL)collectionView:(UICollectionView *)collectionView shouldSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    return YES;
}
*/

/*
// Uncomment these methods to specify if an action menu should be displayed for the specified item, and react to actions performed on the item
- (BOOL)collectionView:(UICollectionView *)collectionView shouldShowMenuForItemAtIndexPath:(NSIndexPath *)indexPath {
	return NO;
}

- (BOOL)collectionView:(UICollectionView *)collectionView canPerformAction:(SEL)action forItemAtIndexPath:(NSIndexPath *)indexPath withSender:(id)sender {
	return NO;
}

- (void)collectionView:(UICollectionView *)collectionView performAction:(SEL)action forItemAtIndexPath:(NSIndexPath *)indexPath withSender:(id)sender {
	
}
*/

@end
